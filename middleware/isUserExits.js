import { User } from "../Models/model.js"


export const isUserExits=async(identifiers)=>{
    if(User.find({...identifiers}))return true;
    else false;
}