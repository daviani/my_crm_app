import React from 'react';

const NavBar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">
                <img className="main-logo ml-5 mr-5" src="/img/logo.png"
                    alt="logo-main"/>
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02"
                    aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Clients</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Factures</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto mr-3">
                    <li className="nav-item ml-3 mr-3">
                        <a href="#" className="nav-link border-primary">
                            Inscription
                        </a>
                    </li>
                    <li className="nav-item ml-3 mr-3">
                        <a href="#" className="btn btn-primary">
                            Connexion
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-danger ml-3 mr-3">
                            Déconnexion
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;



