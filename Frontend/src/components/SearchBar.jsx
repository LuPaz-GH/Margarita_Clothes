export function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      className="search-bar"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  )
}
