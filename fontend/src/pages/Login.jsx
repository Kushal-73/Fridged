import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { logIn } from '../lib/api'
import '../text.css';


const LoginPage = () => {

  const [logInData,setLogInData]=useState({
    name:'',
    password:'',
  });

  const queryClient=useQueryClient();

  const {mutate:logInMutation,isPending,error}=useMutation({
    mutationFn:logIn,
    onSuccess:()=>{queryClient.invalidateQueries({queryKey:['authUser']})},


  })

  const handleSubmit=(e)=>{
    e.preventDefault();
    logInMutation(logInData);
  };


  return (
  
    <div className='font-roboto-noto h-screen flex items-center  justify-center p-4 sm:p-4 md:p-8 bg-apricot '>

      <div className='border border-rich_black-100 flex flex-col lg:flex-row w-full max-w-2xl mx-auto rounded-xl bg-white-500 shadow-lg overflow-hidden'>
        <div className='w-full lg:w-full p-5 sm:p-8 flex-col '>
          <div className='mb-4 flex items-center justify-center gap-2 '>
            <span className='font-roboto-noto text-4xl text-black font-mono font-bold bg-clip-text '>Fridged</span>
          </div>
          <div className='w-full text-black'>
            <form onSubmit={handleSubmit} >
              <div className='space-y-4'>

                  <div className='font-bold opacity-75 text-center text-mint_green'> Good to have you back!</div>
                 
                  {error && (
                <div className='alert alert-error mb-4'>
                  <span>{error.response.data.message}</span>  
                </div>
              )} 
              
                   

                  <div className='form-control w-full'>

                    <label className='label text-lg'>
                      <span className='lable-text text-mint_green'>Name</span>
                    </label>
                    <input type='text' className='input input-bordered w-full bg-tangerine-700' value={logInData.name} onChange={(e)=>setLogInData({...logInData,name: e.target.value})} required/>

                  </div>

                  
                  <div className='form-control w-full'>
                    
                    <label className='label'>
                      <span className='lable-text text-mint_green'>Password </span>
                    </label>
                    <input type='password' className='input input-bordered w-full bg-tangerine-700' value={logInData.password} onChange={(e)=>setLogInData({...logInData,password: e.target.value})} required/>
                    <p className='text-xs opacity-70 mt-1 text-black'>it's mine</p>

                  </div>

                  <button className='btn w-full text-white bg-dark-cyan-300' type='submit'> {isPending ? <> <span className="loading loading-dots loading-xl"></span></>:"LOG IN"}</button>
                </div>
              </form>             
            </div>   
        </div>
      </div>
    </div>
  )
}

export default LoginPage;