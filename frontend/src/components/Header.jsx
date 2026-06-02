import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/nutrifirst-logo-only.png';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="px-6 md:px-12 py-6 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="NutriFirst"
          className="w-20 h-20 md:w-20 md:h-20 object-contain"
        />
      </Link>

      {/* Nav Pills */}
      <nav className="bg-nutri-darker/60 backdrop-blur rounded-full px-2 py-2 flex items-center gap-1 border border-white/5">
        {[
          { to: '/', label: 'Home' },
          { to: '/our-product', label: 'Our Product' },
          { to: '/about', label: 'About Us' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-medium transition-all
              ${isActive
                ? 'text-tosca shadow-glow bg-tosca/5'
                : 'text-white/70 hover:text-white'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Profile / Auth — nama user + tombol logout */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden sm:block text-white font-medium text-sm md:text-base">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="bg-tosca hover:bg-tosca-light text-nutri-bg font-semibold
                px-5 py-2 rounded-full text-sm transition
                hover:shadow-glow active:scale-95"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-tosca hover:bg-tosca-light text-nutri-bg font-semibold
              px-5 py-2 rounded-full text-sm transition
              hover:shadow-glow active:scale-95"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

