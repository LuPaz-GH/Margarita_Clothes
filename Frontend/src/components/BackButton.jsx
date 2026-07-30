import { useNavigate } from 'react-router-dom'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <button type="button" className="back-button" onClick={() => navigate(-1)}>
      <span aria-hidden="true">←</span> Volver
    </button>
  )
}
