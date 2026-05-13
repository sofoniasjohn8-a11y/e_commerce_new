export const apiUrl = "https://e-backend-flame-gamma.vercel.app/api";

export const adminToken = () =>{
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data ? data.token : null;
}
export const userToken = () =>{
    const data = JSON.parse(localStorage.getItem('userInfo'));
    return data ? data.token : null;
}

export const STRIPE_PUBLIC_KEY = 'pk_test_51TGOo9B8PhlUmf5zF2vC8Z6QYt2srBymj9g6ueh0e8AhSapZEkMzKeQLPVvFWxbyL4vqqwUEMwVvKuEcGzyEPV4c00AJiwo570'