import {SIGNUP, LOGIN, LOGOUT } from './types.js' 
import axios from 'axios'; 
import SInfo from 'react-native-sensitive-info';


// add the necessary actions here 
export const signup = (name, email, password, confirmPassword) => (dispatch) => {
    return new Promise(async (resolve, reject) => {
        if (password != confirmPassword) {
            reject("Password and Confirm Password must be the same!"); 
        }
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            reject("None of the fields should be empty!"); 
        }
        axios.post("http://localhost:8080/auth/signup", {name: name, email: email, password: password, confirmPassword: confirmPassword}).then(async response => {
            // deal with JWT token 
            console.log(response);
            const saveUserToken = await SInfo.setItem('token', response.data.token, {
                sharedPreferencesName: 'mySharedPrefs',
                keychainService: 'myKeychain'
            }); 
            dispatch({type: SIGNUP, data: response.data.user});
            resolve()

        }).catch(err => {
            console.log("error", err); 
            reject(err); 
        })
    })
}

export const login = (email, password) => (dispatch) => {
    return new Promise(async (resolve, reject) => {
        if (email === "" || password === "") {
            reject("Must fill out email and password fields"); 
        }
        else { 
           axios.post("http://localhost:8080/auth/login", {email: email, password: password}).then(async response => {
            console.log(response);
            const saveUserToken = await SInfo.setItem('token', response.data.token, {
                sharedPreferencesName: 'mySharedPrefs',
                keychainService: 'myKeychain'
            }); 
            dispatch({type: LOGIN, data: response.data.user});
            resolve();  

           }).catch(error => {
               console.log(error);
               reject(error); 
           }) 
        }
    })
}

export const logout = () => async dispatch => {
    const deleteKey = await SInfo.deleteItem('token', {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain'
    });
    dispatch({type: LOGOUT})
}


export const search = (query) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('query', query)
            const jwt = await SInfo.getItem('token', {
                sharedPreferencesName: 'mySharedPrefs',
                keychainService: 'myKeychain'
            })
            axios.get(`http://localhost:8080/auth/search-query?query=${query}`, 
            {
                headers: {"Authorization": jwt
            
            }}).then(res => {
                // return users after search query 
                console.log(res.data.users)
                resolve(res.data.users); 
            }).catch(err => {
                console.log('error here', err)
                reject(err)
            })
        }
        catch(err) {
            reject(err)
        }
    })
}



export const isFriend = (id) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const jwt = await SInfo.getItem('token', {
                sharedPreferencesName: 'mySharedPrefs',
                keychainService: 'myKeychain'
            });

            axios.get(`http://localhost:8080/auth/is-friend?rID=${id}`, 
            {
                headers: {"Authorization": jwt
            
            }}).then(res => {
                // return the status of their friendship
                console.log(res.data.status)
                resolve(res.data.status); 
            }).catch(err => {
                console.log('error here', err)
                reject(err)
            })


        }
        catch(err) {
            console.log(err); 
            reject(err); 
        }
    })
}



export const handleFriendRequest = (status, recipientID, handlePending) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const jwt = await SInfo.getItem('token', {
                sharedPreferencesName: 'mySharedPrefs',
                keychainService: 'myKeychain'
            });

            // based on the status determine the nature of the request 
            if (status == 0) {
                axios.post(`http://localhost:8080/auth/add-friend`, {recipientID: recipientID},  
                {   
                    headers: {"Authorization": jwt
                
                }}).then(res => {
                    // returns updated user 
                    console.log(res.data.user)
                    resolve(res.data.user); 
                }).catch(err => {
                    console.log('error here', err)
                    reject(err)
                })
            }
            else if (status == 1) {
                // means we have currently sent a friend request to the other user but we want to remove it 
                axios.post(`http://localhost:8080/auth/handle-friend-request`, {recipientID: recipientID, acceptedRequest: "false"}, {headers: {"Authorization": jwt}}).then(user => {
                    console.log('updated user', user)
                    console.log("Succesfully removed friend request"); 
                    resolve(user); 
                }).catch(err => {
                    console.log(err); 
                    reject(err); 
                })
            }
            else if (status == 2) {
                // pending request from user, we must accept or decline
                axios.post(`http://localhost:8080/auth/handle-friend-request`, {recipientID: recipientID, acceptedRequest: handlePending.toString()}, {headers: {"Authorization": jwt}}).then(user => {
                    console.log('updated user', user)
                    console.log("Succesfully removed friend request"); 
                    resolve(user); 
                }).catch(err => {
                    console.log(err); 
                    reject(err); 
                })
            }
            else { 
                // currently friends but no longer want to be 
                axios.post(`http://localhost:8080/auth/handle-friend-request`, {recipientID: recipientID, acceptedRequest: handlePending.toString()}, {headers: {"Authorization": jwt}}).then(user => {
                    console.log('updated user', user)
                    console.log("Succesfully removed friend"); 
                    resolve(user); 
                }).catch(err => {
                    console.log(err); 
                    reject(err); 
                })
            }

        } catch(err) {
            console.log(err)
            reject(err); 
        } 
    })
}

