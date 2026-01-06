export const initialStore = () => {
  return {
    message: null,
    contacts: [],
    loading: false,
    error: null,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_loading':
      return {
        ...store,
        loading: action.payload
      };
    
    case 'set_contacts':
      return {
        ...store,
        contacts: action.payload,
        loading: false,
        error: null
      };
    
    case 'add_contact':
      return {
        ...store,
        contacts: [...store.contacts, action.payload],
        message: 'Contacto agregado exitosamente'
      };
    
    case 'update_contact':
      return {
        ...store,
        contacts: store.contacts.map((contact) => 
          contact.id === action.payload.id ? action.payload : contact
        ),
        message: 'Contacto actualizado exitosamente'
      };
    
    case 'delete_contact':
      return {
        ...store,
        contacts: store.contacts.filter((contact) => contact.id !== action.payload),
        message: 'Contacto eliminado exitosamente'
      };
    
    case 'set_error':
      return {
        ...store,
        error: action.payload,
        loading: false
      };
    
    case 'clear_message':
      return {
        ...store,
        message: null
      };
    
    default:
      throw Error('Unknown action.');
  }    
}
