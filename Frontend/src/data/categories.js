export const categories = [
  {
    slug: 'dama',
    navLabel: 'Damas',
    title: 'Ropa de Dama',
    bannerLabel: 'Dama',
    image:
      'https://images.unsplash.com/photo-1678801868819-4e17d4ea7cde?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'adolescente',
    navLabel: 'Adolescentes',
    title: 'Ropa de Adolescente',
    bannerLabel: 'Adolescente',
    image:
      'https://i.pinimg.com/736x/fb/db/53/fbdb5371cda57dcf79e56fea58de2c14.jpg',
  },
  {
    slug: 'nina',
    navLabel: 'Niñas',
    title: 'Ropa de Niña',
    bannerLabel: 'Niña',
    image:
      'https://images.unsplash.com/photo-1697906099774-6a2512e43b53?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'beba',
    navLabel: 'Bebas',
    title: 'Ropa de Bebé',
    bannerLabel: 'Bebé',
    image:
      'https://images.unsplash.com/photo-1594299590683-6d6ab3e14c53?auto=format&fit=crop&w=800&q=80',
  },
]

export function getCategoryBySlug(slug) {
  return categories.find((category) => category.slug === slug)
}
