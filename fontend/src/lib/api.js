import {axiosInstance} from "./axios";

export const logIn= async (loginData)=>{
      try {
       const res = await axiosInstance.post('/auth/login',loginData);

       return res.data;

      } catch (error) {
            return null
      }
   
}

export const logMeOut=async()=>{
      const res=await axiosInstance.post('/auth/logout');
      return res.data;
}

export const getAuthUser=async() =>{
      try {
            const res =await axiosInstance.get('/auth/me');
            return res.data;
      } catch (error) {
            return null;
      }
}

export const updateScore= async(bestScore)=>{
      const res=await axiosInstance.patch('/crud/updateScore',{bestScore:bestScore});
      return res.data;
}

export const qUpdate=async(itemList)=>{
      try {
            const res=await axiosInstance.put('/crud/updateItems',{changeItems:itemList});
            return res.data;
      } catch (error) {
            return null;
      }
}

export const addNew=async(newItem)=>{
      try {
            if(!newItem){
                  return console.log('no item')
            }
            const res=await axiosInstance.post('/crud/addNewItem',newItem);
            return res.data;
      } catch (error) {
            return null;
      }
}


export const newUpdateList=async()=>{
      try {
            const res=await axiosInstance.delete('/crud/newUpdateList');
            return res.data;
      } catch (error) {
            return null;
      }
}

export const restUsers=async()=>{
      const res=await axiosInstance.get('/crud/otherUser')
      return res.data;
}

