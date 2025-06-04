'use server';

import dbConnect from '@/lib/mongodb';
import EntityName, { IEntityName } from '@/models/EntityName';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const createEntitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

const updateEntitySchema = createEntitySchema.partial();

// Helper function to get authenticated user
async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  return session.user;
}

// Helper function for error handling
function handleError(error: unknown, context: string) {
  console.error(`${context} error:`, error);
  
  if (error instanceof z.ZodError) {
    throw new Error(`Validation error: ${error.errors[0].message}`);
  }
  
  if (error instanceof Error) {
    throw error;
  }
  
  throw new Error(`An unexpected error occurred in ${context}`);
}

/**
 * Create new entity
 */
export async function createEntity(formData: FormData) {
  try {
    const user = await getAuthenticatedUser();
    
    // Parse and validate input
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
    };
    
    const validatedData = createEntitySchema.parse(data);
    
    // Connect to database
    await dbConnect();
    
    // Create new entity
    const entity = new EntityName({
      ...validatedData,
      userId: user.id
    });
    
    await entity.save();
    
    // Revalidate cache
    revalidatePath('/dashboard/entities');
    revalidateTag('user-entities');
    
    return { success: true, entity: entity.toObject() };
    
  } catch (error) {
    handleError(error, 'createEntity');
  }
}

/**
 * Get all entities for user
 */
export async function getEntities(userId?: string) {
  try {
    // If no userId provided, get from session
    if (!userId) {
      const user = await getAuthenticatedUser();
      userId = user.id;
    }
    
    await dbConnect();
    
    const entities = await EntityName.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    return entities;
    
  } catch (error) {
    handleError(error, 'getEntities');
  }
}

/**
 * Get single entity by ID
 */
export async function getEntity(entityId: string) {
  try {
    const user = await getAuthenticatedUser();
    
    await dbConnect();
    
    const entity = await EntityName.findOne({
      _id: entityId,
      userId: user.id
    }).lean();
    
    if (!entity) {
      throw new Error('Entity not found');
    }
    
    return entity;
    
  } catch (error) {
    handleError(error, 'getEntity');
  }
}

/**
 * Update entity
 */
export async function updateEntity(entityId: string, formData: FormData) {
  try {
    const user = await getAuthenticatedUser();
    
    // Parse and validate input
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
    };
    
    const validatedData = updateEntitySchema.parse(data);
    
    await dbConnect();
    
    // Update entity (only if user owns it)
    const entity = await EntityName.findOneAndUpdate(
      { _id: entityId, userId: user.id },
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!entity) {
      throw new Error('Entity not found or unauthorized');
    }
    
    // Revalidate cache
    revalidatePath('/dashboard/entities');
    revalidateTag('user-entities');
    
    return { success: true, entity: entity.toObject() };
    
  } catch (error) {
    handleError(error, 'updateEntity');
  }
}

/**
 * Delete entity
 */
export async function deleteEntity(entityId: string) {
  try {
    const user = await getAuthenticatedUser();
    
    await dbConnect();
    
    // Delete entity (only if user owns it)
    const result = await EntityName.findOneAndDelete({
      _id: entityId,
      userId: user.id
    });
    
    if (!result) {
      throw new Error('Entity not found or unauthorized');
    }
    
    // Revalidate cache
    revalidatePath('/dashboard/entities');
    revalidateTag('user-entities');
    
    return { success: true };
    
  } catch (error) {
    handleError(error, 'deleteEntity');
  }
}

/**
 * Update entity status
 */
export async function updateEntityStatus(entityId: string, status: string) {
  try {
    const user = await getAuthenticatedUser();
    
    // Validate status
    if (!['active', 'inactive', 'archived'].includes(status)) {
      throw new Error('Invalid status');
    }
    
    await dbConnect();
    
    const entity = await EntityName.findOneAndUpdate(
      { _id: entityId, userId: user.id },
      { status },
      { new: true }
    );
    
    if (!entity) {
      throw new Error('Entity not found or unauthorized');
    }
    
    // Revalidate cache
    revalidatePath('/dashboard/entities');
    revalidateTag('user-entities');
    
    return { success: true, entity: entity.toObject() };
    
  } catch (error) {
    handleError(error, 'updateEntityStatus');
  }
}

/**
 * Get entities with filters
 */
export async function getFilteredEntities(filters: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const user = await getAuthenticatedUser();
    
    await dbConnect();
    
    // Build query
    const query: any = { userId: user.id };
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const entities = await EntityName.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 20)
      .skip(filters.offset || 0)
      .lean();
    
    // Get total count for pagination
    const total = await EntityName.countDocuments(query);
    
    return { entities, total };
    
  } catch (error) {
    handleError(error, 'getFilteredEntities');
  }
}

/**
 * Get entity statistics
 */
export async function getEntityStats() {
  try {
    const user = await getAuthenticatedUser();
    
    await dbConnect();
    
    const stats = await EntityName.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(user.id) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format stats
    const formattedStats = {
      total: 0,
      active: 0,
      inactive: 0,
      archived: 0
    };
    
    stats.forEach(stat => {
      formattedStats[stat._id as keyof typeof formattedStats] = stat.count;
      formattedStats.total += stat.count;
    });
    
    return formattedStats;
    
  } catch (error) {
    handleError(error, 'getEntityStats');
  }
} 