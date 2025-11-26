
import { useState, useEffect,useMemo } from 'react';
import './gridFor.css'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { qUpdate , addNew ,newUpdateList,restUsers,logMeOut} from '../lib/api';
import {useMediaQuery} from 'react-responsive';
import { BottleWine ,Apple,Banana,Pizza,Popsicle,Milk,CupSoda,Drumstick,Fish ,DoorOpen,ScrollText} from 'lucide-react';


import useAuthUser from '../hooks/useAuthUser'
import toast from 'react-hot-toast';


const Grid = () => {

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })

  const queryClient=useQueryClient();
  const [showAllItemsModal, setShowAllItemsModal] = useState(false);

  const {isLoading, authUser}=useAuthUser();
  useEffect(() => {
    if (authUser?.items) {
      const quantities = {};
      authUser.items.forEach(item => {
        quantities[item.name] = item.quantity;
      });
      setItemQuantity(quantities);
    }
  }, [authUser])

  const {data:otherUser=[],isLoading:userLoading}=useQuery({
    queryKey:['otherUser'],
    queryFn:restUsers,
  })

  const [itemQuantity, setItemQuantity] = useState({});

  const [newItem ,setNewItem]=useState("");

const {mutate:mutateNow,isPending}=useMutation({
    mutationFn:async ()=>{
      if(Object.keys(itemQuantity).length>0){
        await qUpdate(itemQuantity);
      }

      if(newItem){
        await addNew(newItem);
      }

      await newUpdateList();
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
      setNewItem("");
    },
})

const {mutate:logOut}=useMutation({
    mutationFn:logMeOut,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
    }
  });

   const allItemsList = useMemo(() => {
    if (userLoading || isLoading) return [];

    const allUsers = [...otherUser];
    if (authUser && authUser._id) {
      allUsers.push(authUser);
    }

    const itemsMap = new Map();

    allUsers.forEach(user => {
      if (user.items && Array.isArray(user.items)) {
        user.items.forEach(item => {
          if (itemsMap.has(item.name)) {
            const existing = itemsMap.get(item.name);
            itemsMap.set(item.name, {
              name: item.name,
              quantity: existing.quantity + (item.quantity || 0),
              users: [...existing.users, user.name]
            });
          } else {
            itemsMap.set(item.name, {
              name: item.name,
              quantity: item.quantity || 0,
              users: [user.name]
            });
          }
        });
      }
    });

    return Array.from(itemsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}, [otherUser, authUser, userLoading, isLoading]);



  if(isLoading){
    return <div className='h-screen'>Loading...</div>
  }

  return (
    <>
      <div className="navbar bg-tangerine-700 text-black shadow-sm">
        <div className="flex-1">
          <div className="font-bold alfa-slab-one-regular sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-jasper to-jasper-400 transition-all duration-300 hover:tracking-wide hover:from-glaucous-500 hover:to-air_superiority_blue-500 drop-shadow-md transform hover:scale-100" >Welcome,  {authUser.name}</div>
        </div>
      <div className="flex-none">
      <button className="btn btn-square size-18 btn-ghost transition-transform duration-300 hover:scale-110 bg-jasper-600" onClick={logOut}>
        <DoorOpen/>
      </button>
      </div>
    </div>
   
    <div className='grid-container '>
      
      <div className='grid-item grid-item-span-2 h-[360px] text-white-400'>

        <div className={`h-full flex ${ isDesktopOrLaptop ? 'flex-row justify-start ':'flex-col justify-center'} items-center justify-center  overflow-hidden p-4 `}>
          {isDesktopOrLaptop &&(
             <div className='p-3 mr-4 background-container-2 border-separate rounded-md w-[50%] h-[100%] flex items-center justify-center text-8xl alfa-slab-one-regular transition-transform duration-300 hover:scale-90 cursor-pointer'>{authUser?.room}</div>
          )}
          <div className=' p-3 bg-dark-cyan-400 rounded-lg shadow-xl w-full overflow-y-auto scrollbar-hide h-[100%]'style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflow: '-moz-scrollbars-none',
        }}> 
            <form onSubmit={(e)=>{
              e.preventDefault();     
              mutateNow();
              toast.success('successfully updated')
            }}>
              <div className='flex flex-row'>
                <input type="text" id='1' placeholder="enter item to add" className={`input input-sm w-[70%] font-roboto-noto mb-2`} onChange={(e) =>setNewItem({...newItem,item:(e.target.value)})}/>
                <button onClick={() => setShowAllItemsModal(true)} type="button"  className="btn btn-ghost transition-transform duration-300 hover:scale-110 bg-dark-cyan-300 ml-2"><ScrollText/></button>
                {showAllItemsModal && (
                  <div className="modal modal-open ">
                    <div className="modal-box max-w-lg bg-dark-cyan-200 text-white-400">
                      <h3 className="font-bold text-2xl alfa-slab-one-regular mb-4 text-center underline">Inventory</h3>
                      <div className="max-h-96 overflow-y-auto scrollbar-hide"style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
                        {allItemsList.map((item, index) => (
                          <div key={index} className="flex flex-col items-center py-2 border-b">
                            <span className="font-medium font-roboto-noto '">{item.name}</span>
                            <span className="badge bg-red-800">{item.quantity}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-400">
                                {item.users.join(', ')}   
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="modal-action">
                        <button 
                          onClick={() => setShowAllItemsModal(false)}
                          className="btn"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex flex-row gap-2'>
                 <BottleWine/><Apple/><Pizza/><Banana/><Milk/><Popsicle/><CupSoda/><Drumstick/><Fish/>
              </div>

            <ul className='list-disc list-inside'>        
            
              {authUser.items && authUser.items.length > 0 ? (
                
                authUser.items.map((item, index) => (          
                  <li key={index} className='text-md mt-1 font-roboto-noto '>{item.name} :
                   <input type="number" onChange={(e) => setItemQuantity({ ...itemQuantity, [item.name]: parseInt(e.target.value) || 0})}  min="0" step="1" className={`input input-xs ml-2 ${isDesktopOrLaptop? 'w-[10%]' : 'w-[20%]'}  font-roboto-noto`} value={itemQuantity[item.name] || 0} />
                  </li>
                ))
              ) : (
                <li className='text-md'>No items found.</li>
              )}
            </ul>
            <button type="submit" className={` btn btn-sm w-[100%]  mt-2 border-none font-roboto-noto transition-transform duration-300 hover:bg-air_superiority_blue-300 text-lg text-ghost_white-500 cursor-pointer`}>
              {isPending? <span className="loading loading-dots loading-m "></span>:'UPDATE'}
            </button>
          
            </form> 
          </div>
        </div>
      </div>

      <div className={`grid-item flex flex-col overflow-y-auto scrollbar-hide grid-design `} style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
        {isLoading ? (<div className='skeleton h-full w-full bg-inherit'>
        </div>) : (
           <div className='items-start justify-start text-2xl alfa-slab-one-regular tracking-wide text-white-400'>
          {otherUser[0]?.name}
          <div>
            <div className="relative">
              <div className="absolute inset-0 border-t-2 border-dashed border-tangerine"></div>
            </div>
            <div className='font-roboto-noto text-base p-1 '>     
              {otherUser[0]?.items.map((item,index)=>(

                  <li key={index} className='list-none '>
                    {item.name} :  {item.quantity}
                  </li>

              ))}       
            </div>
          </div>
        </div>
        )}
       
      </div>
      <div className='grid-item flex flex-col overflow-y-auto scrollbar-hide grid-design h-[174px]'style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
        {isLoading ? (<div className='skeleton h-full w-full bg-inherit'>
        </div>) : (
           <div className='items-start justify-start text-2xl alfa-slab-one-regular tracking-wide text-white-400'>
          {otherUser[1]?.name}
          <div>
            <div className="relative">
              <div className="absolute inset-0 border-t-2 border-dashed border-tangerine"></div>
            </div>
            <div className='font-roboto-noto text-base p-1'>     
              {otherUser[1]?.items.map((item,index)=>(

                  <li key={index} className='list-none'>
                    {item.name} :  {item.quantity}
                  </li>

              ))}       
            </div>
          </div>
        </div>
        )}</div>
      <div className='grid-item flex flex-col overflow-y-auto scrollbar-hide grid-design h-[174px]'style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
        {isLoading ? (<div className='skeleton h-full w-full bg-inherit'>
        </div>) : (
           <div className='items-start justify-start text-2xl alfa-slab-one-regular tracking-wide text-white-400'>
          {otherUser[2]?.name}
          <div>
            <div className="relative">
              <div className="absolute inset-0 border-t-2 border-dashed border-tangerine"></div>
            </div>
            <div className='font-roboto-noto text-base p-1'>     
              {otherUser[2]?.items.map((item,index)=>(

                  <li key={index} className='list-none'>
                    {item.name} :  {item.quantity}
                  </li>

              ))}       
            </div>
          </div>
        </div>
        )}</div>
     <div className='grid-item flex flex-col overflow-y-auto scrollbar-hide grid-design h-[174px]'style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
        {isLoading ? (<div className='skeleton h-full w-full bg-inherit'>
        </div>) : (
           <div className='items-start justify-start text-2xl alfa-slab-one-regular tracking-wide text-white-400'>
          {otherUser[3]?.name}
          <div>
            <div className="relative">
              <div className="absolute inset-0 border-t-2 border-dashed border-tangerine"></div>
            </div>
            <div className='font-roboto-noto text-base p-1'>     
              {otherUser[3]?.items.map((item,index)=>(

                  <li key={index} className='list-none'>
                    {item.name} :  {item.quantity}
                  </li>

              ))}       
            </div>
          </div>
        </div>
        )}</div>
      <div className={`grid-item grid-item-span-3 flex flex-col overflow-y-auto scrollbar-hide grid-design h-[174px]`}style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
        {isLoading ? (<div className='skeleton h-full w-full bg-inherit'>
        </div>) : (
           <div className={`item-start justify-start text-2xl alfa-slab-one-regular tracking-wide text-white-400`}>
          {otherUser[4]?.name}
          <div>
            <div className="relative">
              <div className="absolute inset-0 border-t-2 border-dashed border-tangerine"></div>
            </div>
            <div className='font-roboto-noto text-base p-1'>     
              {otherUser[4]?.items.map((item,index)=>(

                  <li key={index} className='list-none text-start'>
                    {item.name} :  {item.quantity}
                  </li>

              ))}       
            </div>
          </div>
        </div>
        )}</div>
    </div>
    </>
  )
}

export default Grid 