import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import {Link, NavLink} from "react-router-dom";

const CustomersPage = props => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    //Requête HTTP get axios pour récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response)
        }
    };
    useEffect(() => {
        fetchCustomers();
    }, []);

    //Requête HTTP delete pour la suppresion des customers
    const handleDelete = async id => {
        //Clone du mon tableaux initial
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !== id));
        try {
            await CustomersAPI.delete(id);
        } catch (error) {
            console.error(error.response);
            setCustomers(originalCustomers);
        }
    };

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 9;

    //filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    //pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className=" mb-4 d-flex justify-content-between align-items-center">
                <h1>
                    Liste des Clients
                </h1>
                <Link to="/customers/new" className="btn btn-primary border-delete">
                    Créer un client
                </Link>
            </div>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher..."
                    onChange={handleSearch}
                    value={search}
                />
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="text-center">
                        Id.
                    </th>
                    <th className="text-center">
                        Client
                    </th>
                    <th className="text-center">
                        Email
                    </th>
                    <th className="text-center">
                        Entreprise
                    </th>
                    <th className="text-center">
                        Factures
                    </th>
                    <th className="text-center">
                        Montant total
                    </th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td className="text-center mt-5">
                            <Link to={"customers/" +customer.id}>
                                {customer.id}
                            </Link>
                        </td>
                        <td className="text-center mt-5">
                            <Link to={"/customers/" + customer.id}>
                                {customer.firstName} {customer.lastName}
                            </Link>
                        </td>
                        <td className="text-center mt-5">
                            {customer.email}
                        </td>
                        <td className="text-center mt-5">
                            {customer.company}
                        </td>
                        <td className="text-center mt-5">
                            <span className="badge badge-pill badge-primary">
                            {customer.invoices.length}
                            </span>
                        </td>
                        <td className="text-center mt-5">
                            {customer.totalAmount.toLocaleString()} €
                        </td>
                        <td className="text-center mt-5">
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-sm btn-danger border-delete">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
    );
};

export default CustomersPage;
