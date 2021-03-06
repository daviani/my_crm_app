import React, { useEffect, useState } from 'react'
import Field                          from '../components/forms/Field'
import { Link }                       from 'react-router-dom'
import Select                         from '../components/forms/Select'
import CustomersAPI                   from '../services/CustomersAPI'
import InvoicesAPI                    from '../services/InvoicesAPI'
import { toast }                      from 'react-toastify'
import FormContentLoader              from '../components/loader/FormContentLoader'

const InvoicePage = ( {history, match} ) => {
    const {id = 'new'}                    = match.params
    const [loading, setloading]           = useState( true )
    const [editingState, setEditingState] = useState( false )
    const [invoiceState, setInvoiceState] = useState( {
        amount:   '',
        customer: '',
        status:   'SENT'
    } )

    const [customersListState, setCustomerListState] = useState( [] )
    const [errorsState, setErrorsState]              = useState( {
        amount:   '',
        customer: '',
        status:   ''
    } )

    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomerListState( data )
            setloading( false )
            if ( !invoiceState.customer ) {
                setInvoiceState( {
                    ...invoiceState, customer: data[0].id
                } )
            }
        } catch (e) {
            toast.error( 'impossible de charger les clients' )
            history.replace( '/invoices' )
        }
    }

    // Charge les données d'une factures
    const fetchInvoice = async () => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find( id )
            setInvoiceState( {amount, status, customer: customer.id} )
            setloading( false )
        } catch (e) {
            toast.error( 'Votre facture n\'as pu être charger' )
            history.replace( '/invoices' )
        }
    }

    //Récupération de la liste de clients
    useEffect( () => {
        fetchCustomers()
    }, [] )

    //Récupération de la bonne facture quand l'indantifiant de l'URL change
    useEffect( () => {
        if ( id !== 'new' ) {
            setEditingState( true )
            fetchInvoice( id )
        }
    }, [id] )

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ( {currentTarget} ) => {
        const {name, value} = currentTarget
        setInvoiceState( {...invoiceState, [name]: value} )
    }

    //Envoie du formulaire et gestion des erreurs
    const handleSubmit = async event => {
        event.preventDefault()
        try {
            if ( editingState ) {
                await InvoicesAPI.update( invoiceState, id )
                toast.success( 'La facture a bien été modifiée' )
                history.replace( '/invoices' )
            } else {
                await InvoicesAPI.create( invoiceState )
                toast.success( 'La facture a bien été créée' )
                history.replace( '/invoices' )
            }
        } catch ({response}) {
            const {violations} = response.data
            if ( violations ) {
                const apiErrors = {}
                violations.forEach( ( {propertyPath, message} ) => {
                    apiErrors[propertyPath] = message
                } )
                setErrorsState( apiErrors )
                toast.error( 'Des erreurs dans votre formulaire !' )
            }
        }
    }

    return (
        <>
            <div className='container jumbotron'>
                { (!editingState &&
                    <h1>Création d'une facture</h1>) ||
                (<h1>Modification d'une facture</h1>
                ) }
                { loading && <FormContentLoader/> }
                { !loading &&
                <form onSubmit={ handleSubmit }>
                    <Field name='amount'
                           label='Montant'
                           placeholder='Montant de la facture'
                           value={ invoiceState.amount }
                           onChange={ handleChange }
                           error={ errorsState.amount }
                           type='number'/>
                    <Select
                        name='customer'
                        label='Client'
                        value={ invoiceState.customer }
                        onChange={ handleChange }
                        error={ errorsState.customer }>
                        { customersListState.map( customer =>
                            <option key={ customer.id }
                                    value={ customer.id }>
                                { customer.firstName } { customer.lastName }
                            </option>
                        ) }
                    </Select>
                    <Select name='status'
                            label='Statut'
                            value={ invoiceState.status }
                            onChange={ handleChange }
                            error={ errorsState.customer }>
                        <option value='SENT'>
                            Envoyée
                        </option>
                        <option value='PAID'>
                            Payée
                        </option>
                        <option value='CANCELLED'>
                            Annulée
                        </option>
                    </Select>

                    <div className='form-group d-flex justify-content-between align-items-center'>
                        <button type='submit' className='btn btn-primary border-delete mt-1'>
                            Enregistrer
                        </button>
                        <Link to='/invoices' className='btn btn-link mt-1'>
                            Retour aux factures
                        </Link>
                    </div>
                </form>
                }
            </div>
        </>
    )
}

export default InvoicePage



