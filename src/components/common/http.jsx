export const apiUrl = "http://127.0.0.1:8000/api";

export const adminToken = () =>{
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}
export const userToken = () =>{
    const data = JSON.parse(localStorage.getItem('userInfo'));
    return data.token;
}

export const STRIPE_PUBLIC_KEY = 'pk_test_51TGOo9B8PhlUmf5zF2vC8Z6QYt2srBymj9g6ueh0e8AhSapZEkMzKeQLPVvFWxbyL4vqqwUEMwVvKuEcGzyEPV4c00AJiwo570'