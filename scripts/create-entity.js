#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toPascalCase(str) {
  return str.replace(/(?:^|[-_])(\w)/g, (_, char) => char.toUpperCase());
}

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createEntityFiles(entityName) {
  const pascalName = toPascalCase(entityName);
  const camelName = toCamelCase(pascalName);
  const kebabName = toKebabCase(entityName);
  const pluralName = `${camelName}s`;
  const pluralPascal = `${pascalName}s`;

  console.log(`\n🚀 Creating entity: ${pascalName}`);
  console.log(`   - Model: I${pascalName}`);
  console.log(`   - Actions: ${camelName}.ts`);
  console.log(`   - Components: ${pascalName}Card.tsx`);
  console.log(`   - Page: /dashboard/${pluralName}`);

  // Create directories if they don't exist
  const dirs = [
    'models',
    'actions', 
    'components',
    `app/dashboard/${pluralName}`
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✅ Created directory: ${dir}`);
    }
  });

  // Template replacements
  const replacements = {
    'EntityName': pascalName,
    'IEntityName': `I${pascalName}`,
    'entity': camelName,
    'entities': pluralName,
    'Entity': pascalName,
    'Entities': pluralPascal,
    'entity-name': kebabName,
    'entities-name': toKebabCase(pluralName)
  };

  // 1. Create Model
  try {
    let modelTemplate = fs.readFileSync('templates/model-template.ts', 'utf8');
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      modelTemplate = modelTemplate.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    fs.writeFileSync(`models/${pascalName}.ts`, modelTemplate);
    console.log(`   ✅ Created model: models/${pascalName}.ts`);
  } catch (error) {
    console.error(`   ❌ Error creating model: ${error.message}`);
  }

  // 2. Create Actions
  try {
    let actionTemplate = fs.readFileSync('templates/action-template.ts', 'utf8');
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      actionTemplate = actionTemplate.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    fs.writeFileSync(`actions/${camelName}.ts`, actionTemplate);
    console.log(`   ✅ Created actions: actions/${camelName}.ts`);
  } catch (error) {
    console.error(`   ❌ Error creating actions: ${error.message}`);
  }

  // 3. Create Components
  try {
    let componentTemplate = fs.readFileSync('templates/component-template.tsx', 'utf8');
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      componentTemplate = componentTemplate.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    fs.writeFileSync(`components/${pascalName}Card.tsx`, componentTemplate);
    console.log(`   ✅ Created component: components/${pascalName}Card.tsx`);
  } catch (error) {
    console.error(`   ❌ Error creating component: ${error.message}`);
  }

  // 4. Create Page
  try {
    let pageTemplate = fs.readFileSync('templates/page-template.tsx', 'utf8');
    Object.entries(replacements).forEach(([placeholder, replacement]) => {
      pageTemplate = pageTemplate.replace(new RegExp(placeholder, 'g'), replacement);
    });
    
    fs.writeFileSync(`app/dashboard/${pluralName}/page.tsx`, pageTemplate);
    console.log(`   ✅ Created page: app/dashboard/${pluralName}/page.tsx`);
  } catch (error) {
    console.error(`   ❌ Error creating page: ${error.message}`);
  }

  // 5. Update Sidebar (optional)
  console.log(`\n📝 Manual steps required:`);
  console.log(`   1. Add navigation item to components/Sidebar.tsx:`);
  console.log(`      {`);
  console.log(`        name: '${pluralPascal}',`);
  console.log(`        href: '/dashboard/${pluralName}',`);
  console.log(`        icon: YourIcon,`);
  console.log(`      }`);
  console.log(`   2. Import and fix any missing dependencies`);
  console.log(`   3. Update the model schema according to your business logic`);
  console.log(`   4. Customize validation rules in actions`);
  console.log(`   5. Style components according to your design system`);

  console.log(`\n🎉 Entity ${pascalName} created successfully!`);
  console.log(`📁 Files created:`);
  console.log(`   - models/${pascalName}.ts`);
  console.log(`   - actions/${camelName}.ts`);
  console.log(`   - components/${pascalName}Card.tsx`);
  console.log(`   - app/dashboard/${pluralName}/page.tsx`);
}

async function main() {
  console.log('🏗️  OnlyNextjs Util - Entity Generator');
  console.log('=====================================\n');

  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    console.error('❌ Error: Please run this script from the project root directory');
    process.exit(1);
  }

  // Check if templates exist
  const requiredTemplates = [
    'templates/model-template.ts',
    'templates/action-template.ts', 
    'templates/component-template.tsx',
    'templates/page-template.tsx'
  ];

  for (const template of requiredTemplates) {
    if (!fs.existsSync(template)) {
      console.error(`❌ Error: Template not found: ${template}`);
      console.error('Please make sure all template files exist in the templates/ directory');
      process.exit(1);
    }
  }

  try {
    const entityName = await askQuestion('Enter entity name (e.g., Task, Project, Habit): ');
    
    if (!entityName || entityName.trim().length === 0) {
      console.error('❌ Error: Entity name is required');
      process.exit(1);
    }

    const confirm = await askQuestion(`\nThis will create files for entity "${entityName}". Continue? (y/N): `);
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      console.log('Operation cancelled.');
      process.exit(0);
    }

    await createEntityFiles(entityName.trim());

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle script arguments
if (process.argv.length > 2) {
  const entityName = process.argv[2];
  console.log('🏗️  OnlyNextjs Util - Entity Generator');
  console.log('=====================================\n');
  
  createEntityFiles(entityName).then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
} else {
  main();
} 