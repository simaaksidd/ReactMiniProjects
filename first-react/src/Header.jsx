export default function Header() {
    return (
      <header className='header'>
        <img className='react-logo' src='./src/assets/react.svg' alt='react logo'></img>
        <nav>
          <ul className='nav-list'>  
            <li className='nav-item'>Pricing</li>
            <li className='nav-item'>About</li>
            <li className='nav-item'>Contract</li>
          </ul>
        </nav>
      </header>
    )
}  