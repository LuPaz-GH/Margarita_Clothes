require('dotenv').config()
const bcrypt = require('bcryptjs')
const prisma = require('../src/prismaClient')

// Usuario de demostración para que un reclutador/cliente pruebe la app.
// Se puede volver a ejecutar sin problema: si ya existe, actualiza la contraseña.
const demoUser = {
  name: 'Demo Admin',
  email: 'demo@margarita.com',
  password: 'Demo1234',
  role: 'ADMIN',
}

async function main() {
  const passwordHash = await bcrypt.hash(demoUser.password, 10)

  await prisma.user.upsert({
    where: { email: demoUser.email },
    update: { passwordHash, role: demoUser.role, active: true, name: demoUser.name },
    create: {
      name: demoUser.name,
      email: demoUser.email,
      passwordHash,
      role: demoUser.role,
    },
  })

  console.log('Usuario demo listo:')
  console.log(`  Email:      ${demoUser.email}`)
  console.log(`  Contraseña: ${demoUser.password}`)
  console.log(`  Rol:        ${demoUser.role}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
