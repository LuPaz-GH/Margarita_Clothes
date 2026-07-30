import { Link } from 'react-router-dom'
import { categories } from '../data/categories'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h3>Margarita Clothes</h3>
          <p>Moda para toda la familia, de la beba a la dama.</p>
        </div>

        <div className="footer-col">
          <h4>Categorías</h4>
          <ul>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link to={`/categoria/${category.slug}`}>{category.navLabel}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Ayuda</h4>
          <ul>
            <li>Envíos y entregas</li>
            <li>Medios de pago</li>
            <li>Cambios y devoluciones</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li>hola@margaritaclothes.com</li>
            <li>+54 9 11 0000-0000</li>
            <li>Instagram · Facebook · TikTok</li>
          </ul>
        </div>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} Margarita Clothes. Todos los derechos reservados.
      </p>
    </footer>
  )
}
