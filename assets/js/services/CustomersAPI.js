import axios             from 'axios'
import Cache             from './cache'
import { CUSTOMERS_API } from '../config'

async function findAll() {
    const cachedCustomers = await Cache.get( 'customers' )
    if ( cachedCustomers !== null ) return cachedCustomers

    return axios
        .get( CUSTOMERS_API )
        .then( response => {
                const customers = response.data['hydra:member']
                Cache.set( 'customers', customers )
                return customers
            }
        )
}

async function find( id ) {
    const cachedCustomer = await Cache.get( 'customers.' + id )
    if ( cachedCustomer ) return cachedCustomer
    return axios
        .get( CUSTOMERS_API + '/' + id )
        .then( response => {
                const customer = response.data
                Cache.set( 'customer.' + id, customer )
                return customer
            }
        )
}

function create( customerState ) {
    // !! Pas de "/" à la fais de l'url de la requête
    return axios
        .post( CUSTOMERS_API, customerState )
        // Permet de mettre le nouveaux customers en cache
        .then( async response => {
                const cachedCustomers = await Cache.get( 'customers' )
                if ( cachedCustomers ) {
                    Cache.set( 'customers', [...cachedCustomers, response.data] )
                }
                return response
            }
        )
}

function update( id, customerState ) {
    return axios
        .put( CUSTOMERS_API + '/' + id, customerState )
        .then( async response => {
                const cachedCustomers = await Cache.get( 'customers' )
                const cachedCustomer  = await Cache.get( 'customers.' + id )
                if ( cachedCustomer ) {
                    Cache.set( 'customers.' + id, response.data )
                }
                if ( cachedCustomers ) {
                    const index            = cachedCustomers.findIndex( c => c.id === +id )
                    cachedCustomers[index] = response.data
                }
                return response
            }
        )
}

function deleteCustomer( id ) {
    return axios
        .delete( CUSTOMERS_API + '/' + id )
        //Permet de supprimer du cache le customer effacer
        .then( async response => {
                const cachedCustomers = await Cache.get( 'customers' )
                console.log( cachedCustomers )
                if ( cachedCustomers ) {
                    Cache.set(
                        'customers',
                        cachedCustomers.filter( c => c.id !== id )
                    )
                }
                return response
            }
        )
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteCustomer
}