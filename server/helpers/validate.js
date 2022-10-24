const validEmail = (email)=>{
    return String(email)
    .toUpperCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
}

export {validEmail}