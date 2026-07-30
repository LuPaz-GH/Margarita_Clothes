require('dotenv').config()
const prisma = require('../src/prismaClient')

const products = [
  {
    name: 'Vestido Floral',
    price: 15999,
    category: 'Vestidos',
    audience: 'DAMA',
    image: 'https://i.pinimg.com/736x/e0/62/8a/e0628a1fa5237116bfdd3397b2f123f8.jpg',
    description: 'Vestido liviano de algodón con estampado floral, ideal para el verano.',
  },
  {
    name: 'Camisa Oxford',
    price: 12500,
    category: 'Camisas',
    audience: 'DAMA',
    image: 'https://i.pinimg.com/1200x/4a/44/5f/4a445fc4466acf88c3c0dbd17d0f28b0.jpg',
    description: 'Camisa clásica de corte recto, tela Oxford 100% algodón.',
  },
  {
    name: 'Jean Mom Fit',
    price: 18900,
    category: 'Pantalones',
    audience: 'DAMA',
    image: 'https://i.pinimg.com/736x/a6/95/7b/a6957b2163aefdd8180b49e18064b61a.jpg',
    description: 'Jean tiro alto de tiro amplio, silueta cómoda y versátil.',
  },
  {
    name: 'Campera de Jean',
    price: 24900,
    category: 'Camperas',
    audience: 'DAMA',
    image: 'https://i.pinimg.com/736x/b7/95/71/b795717a761f6fac74602f2b07be5fe4.jpg',
    description: 'Campera de jean clásica con botones frontales y bolsillos.',
  },
  {
    name: 'Remera Básica',
    price: 6500,
    category: 'Remeras',
    audience: 'DAMA',
    image: 'http://i.pinimg.com/736x/f6/46/c4/f646c468337e26fac655268ec53a0935.jpg',
    description: 'Remera de algodón peinado, corte oversize.',
  },
  {
    name: 'Pollera Plisada',
    price: 13400,
    category: 'Polleras',
    audience: 'DAMA',
    image: 'https://i.pinimg.com/1200x/db/00/bf/db00bf399d3ed4c7abc33a0e22eb4ec2.jpg',
    description: 'Pollera plisada midi, ideal para looks casuales o formales.',
  },
  {
    name: 'Buzo Oversize Teen',
    price: 14200,
    category: 'Buzos',
    audience: 'ADOLESCENTE',
    image: 'https://i.pinimg.com/736x/30/d2/72/30d2724eb30833af1a9813e4ae962dae.jpg',
    description: 'Buzo de frisa oversize con capucha, perfecto para el día a día.',
  },
  {
    name: 'Jean Skinny Teen',
    price: 16900,
    category: 'Pantalones',
    audience: 'ADOLESCENTE',
    image: 'https://i.pinimg.com/1200x/9c/d9/7e/9cd97e5b356775acc430338d4da114ab.jpg',
    description: 'Jean chupín elastizado, tiro medio, ideal para looks urbanos.',
  },
  {
    name: 'Remera Estampada Teen',
    price: 7900,
    category: 'Remeras',
    audience: 'ADOLESCENTE',
    image: 'https://i.pinimg.com/736x/ab/88/54/ab88540345b73c6e9f7f424f4554f998.jpg',
    description: 'Remera de algodón con estampa gráfica, corte relax.',
  },
  {
    name: 'Vestido Tutú',
    price: 9800,
    category: 'Vestidos',
    audience: 'NINA',
    image: 'https://i.pinimg.com/736x/e0/f3/36/e0f3363cbaabfe894c2f84303e51ef7d.jpg',
    description: 'Vestido con falda de tul, ideal para fiestas y ocasiones especiales.',
  },
  {
    name: 'Conjunto Deportivo Niña',
    price: 11500,
    category: 'Conjuntos',
    audience: 'NINA',
    image: 'https://i.pinimg.com/736x/24/a5/cb/24a5cb244ab7a5b6c23ecdcfa4c69fae.jpg',
    description: 'Conjunto de buzo y jogging de algodón, cómodo para jugar.',
  },
  {
    name: 'Remera Unicornio',
    price: 5900,
    category: 'Remeras',
    audience: 'NINA',
    image: 'https://i.pinimg.com/736x/5e/6e/a0/5e6ea0433f1b3a526780cecb4b634334.jpg',
    description: 'Remera de algodón con estampa de unicornio y brillos.',
  },
  {
    name: 'Body Beba Algodón',
    price: 4500,
    category: 'Bodies',
    audience: 'BEBA',
    image: 'https://i.pinimg.com/736x/bb/e8/99/bbe8992c0425f1b1ff3cc21aca8367e8.jpg',
    description: 'Body de algodón suave, cierre a presión, pack de manga corta.',
  },
  {
    name: 'Enterito Beba',
    price: 8200,
    category: 'Enteritos',
    audience: 'BEBA',
    image: 'https://i.pinimg.com/736x/eb/bb/95/ebbb95e95f1a0399bd292a206ad463bd.jpg',
    description: 'Enterito de algodón con estampa, cómodo y fácil de cambiar.',
  },
  {
    name: 'Conjunto Beba Algodón',
    price: 9600,
    category: 'Conjuntos',
    audience: 'BEBA',
    image: 'https://i.pinimg.com/1200x/d2/a5/bf/d2a5bfa61f860556d9e67b7c5513687b.jpg',
    description: 'Conjunto de remera y pantalón de algodón orgánico.',
  },
]

async function main() {
  for (const product of products) {
    await prisma.product.create({ data: { ...product, stock: 20 } })
  }
  console.log(`${products.length} productos cargados.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
