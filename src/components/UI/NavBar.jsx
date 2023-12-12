import React from 'react';

export default function Header({ user }) {
  return (
    <nav className="navbar navbar-expand-lg bg-secondary bg-gradient text-light">
      <div className="container-fluid">
        <a className="nav-link active text-light" href="/">
          Main
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active text-light" aria-current="page" href="/chat">
                Chat
              </a>
            </li>

            {!user ? (
              <>
                <li className="nav-item">
                  <a className="nav-link active text-light" aria-current="page" href="/reg">
                    Registration
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active text-light" aria-current="page" href="/login">
                    Auth
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <a className="nav-link active text-light" aria-current="page" href="/logout">
                  Logout
                </a>
              </li>
            )}
          </ul>
          {user && <p className="text-light">{user.name}</p>}
        </div>
      </div>
    </nav>
  );
}
