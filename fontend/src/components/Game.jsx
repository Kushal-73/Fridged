import React, { useEffect ,useRef ,useState ,useMemo} from 'react'
import './game.css'
import {useMediaQuery} from 'react-responsive';
import useAuthUser from '../hooks/useAuthUser'
import { restUsers} from '../lib/api';
import { useQueryClient, useMutation, useQuery} from '@tanstack/react-query';
import {updateScore} from '../lib/api'
import { Crown } from 'lucide-react';
const Game = () => {
  const {isLoading, authUser}=useAuthUser();

  const {data:otherUser=[],isLoading:userLoading}=useQuery({
      queryKey:['otherUser'],
      queryFn:restUsers,
  })

  const LeaderBoardData=useMemo(()=>{
    if (userLoading || isLoading) return [];

    const allUsers = [...otherUser];
    if (authUser && authUser._id){
       allUsers.push({
        name: authUser.name,
        score: authUser.score || 0,
      });
    }

    return allUsers
        .map(user => ({
            name: user.name,
            score: user.score,
        }))
        .sort((a, b) => b.score - a.score);

  }, [otherUser, authUser, userLoading, isLoading])

  const queryClient=useQueryClient();

  const {mutate:playerScoreUpdate}=useMutation({
    mutationFn:updateScore,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
      queryClient.invalidateQueries({queryKey:['otherUser']})
    }
  });

  const blockRef=useRef(null);
  const blockRef2=useRef(null);
  const holeRef=useRef(null)
  const holeRef2=useRef(null)
  const charRef=useRef(null)

  const [point,setPoint]=useState(0);
  const [collision,setCollision]=useState(true);
  const [bestScore,setBestScore]=useState(authUser.score);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  let jumping=0;

  const isDesktopOrLaptop = useMediaQuery({
  query: '(min-width: 1224px)'
  })

  useEffect(() => {
    if (authUser?.score) {
      setBestScore(authUser.score);
    }
  }, [authUser]);

  useEffect(() => {
    const hole=holeRef.current;
    const hole2=holeRef2.current;
    const character=charRef.current;
    const block=blockRef.current;
    const block2=blockRef2.current;
    

    const handleAnimationIteration = () => {
      let randomPosition=-((Math.random() * 300) + 150)
      hole.style.top=randomPosition + 'px'
    }
    const handleAnimationIteration2 = () => {
      let randomPosition=-((Math.random() * 300) + 150)
      hole2.style.top=randomPosition + 'px'
    }
    let animationInterval;

    const characterAnimation=()=>{
      animationInterval=setInterval(function(){
        let Characterposition=parseInt(window.getComputedStyle(character).getPropertyValue('top'));

        if(jumping==0){
          character.style.top=(Characterposition+2)+'px'
        }

        let blockLeft=parseInt(window.getComputedStyle(block).getPropertyValue('left'));
        let blockLeft2=parseInt(window.getComputedStyle(block2).getPropertyValue('left'));
        let holeTop=parseInt(window.getComputedStyle(hole).getPropertyValue('top'));
        let holeTop2=parseInt(window.getComputedStyle(hole2).getPropertyValue('top'));

        let cTop=-(500-Characterposition);

        const hasCollided = (Characterposition>480) || ((blockLeft<20)&&(blockLeft>-50) && ((cTop<holeTop)||(cTop>holeTop+130))) ||((blockLeft2<20)&&(blockLeft2>-50) && ((cTop<holeTop2)||(cTop>holeTop2+130)));

        if(hasCollided){

          character.style.top=100+'px';
          clearInterval(animationInterval);
          setBestScore(prev =>(point  >prev?point:prev ));
          if (point > bestScore) {
            const newBestScore = point;
            setBestScore(newBestScore);
            playerScoreUpdate(newBestScore);  
          }
          setCollision(true);
          return;
        }

        setPoint(point=>point+1)

      },10)

    }
    
    if (hole && hole2) {
      hole.addEventListener('animationiteration', handleAnimationIteration);
      hole2.addEventListener('animationiteration', handleAnimationIteration2);
    }

    if(!collision){ 
      characterAnimation()
    }

    return () => {
      if (hole && hole2) {
        hole.removeEventListener('animationiteration', handleAnimationIteration);
        hole2.removeEventListener('animationiteration', handleAnimationIteration2);
      }
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    }
  },  [collision,point])

  const handleJump=()=>{
    if (!charRef.current) return;
    const character=charRef.current;
    jumping=1;
    let jumpCount=0;
    const jumpInterval=setInterval(function(){
      let Characterposition=parseInt(window.getComputedStyle(character).getPropertyValue('top'));
      if((Characterposition >6) && (jumpCount<15) ){
        character.style.top=(Characterposition-5)+'px'
      }
      if(jumpCount>20){
        clearInterval(jumpInterval);
        jumping=0;
        jumpCount=0;
      }
      jumpCount++;
    },10);
  }

  const handleReplay=()=>{
    setPoint(0);
    setCollision(false)
    setShowLeaderboard(false)
    if (charRef.current) {
      charRef.current.style.top = '100px';
    }
  }

  const handleBackFromLeaderboard=()=>{
    setShowLeaderboard(false);
  }
  
  const handleLeader=()=>{
    setShowLeaderboard(true);
  }

  if (userLoading || isLoading) {
    return (
        <div className="flex justify-center items-center h-32">
            <div className="loading loading-spinner loading-lg"></div>
        </div>
    );
  }

  return (
    <>

    {collision ? (!showLeaderboard ?(
     <div className={` ${isDesktopOrLaptop ? 'w-[600px]': 'w-[350px]'} bg-dark-cyan h-[500px] rounded-xl m-auto overflow-hidden relative shadow-2xl shadow-dark-cyan-400`}>
        <div className='flex flex-col items-center justify-center p-4'>
          <p className='text-center text-4xl alfa-slab-one-regular underline text-tangerine-500'>Stats</p>
            <div className="stats shadow mt-4">
            <div className="stat ">
              <div className="stat-title text-2xl">Score</div>
              <div className="stat-value">{point}</div>

            </div>
            <div className="stat">
              <div className="stat-title text-2xl">Best</div>
              <div className="stat-value">{bestScore}</div>

            </div>
            
          </div>
          <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl m-4" onClick={handleReplay}>Play </button>
          <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl m-4 " onClick={handleLeader}>Leader Board </button>
          
        </div>
      </div>): (
        <div className={`game ${isDesktopOrLaptop ? 'w-[600px]': 'w-[350px] '} h-[500px] bg-dark-cyan rounded-xl m-auto relative overflow-hidden shadow-2xl shadow-dark-cyan-4000`} onClick={handleJump}>
          <div className='flex flex-col items-center justify-center p-4'>
            <div className='text-center text-4xl alfa-slab-one-regular underline text-tangerine-500'><div className='flex flex-row gap-4 mt-1 text-tangerine-500'><Crown className='size-10'/>Leader Board<Crown className='size-10'/></div></div>
            <div className='overflow-hidden'>
              <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-4 ">
              <div className='items-center '><button className='btn btn-wide' onClick={handleBackFromLeaderboard}>Play Again</button></div>
          <div className='overflow-y-auto max-h-80' style={{scrollbarWidth: 'none',msOverflowStyle: 'none',overflow: '-moz-scrollbars-none'}}>
            <table className="table">
              <thead className='sticky top-0 bg-base-200'>
                <tr className='text-lg'>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {LeaderBoardData.map((item, index) => (
                  <tr key={index} className='text-base'>
                    <th>{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          </div>
          </div>
        </div>
      )
    ): (
    <div className={`game ${isDesktopOrLaptop ? 'w-[600px]': 'w-[350px] '} h-[500px] bg-dark-cyan  m-auto relative rounded-xl overflow-hidden shadow-2xl shadow-dark-cyan-400`} onClick={handleJump}>
      <div className="absolute top-4 left-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg">
        <div>Score : {point}</div>
        <div>Best : {bestScore}</div>
      </div>
      <div className='flex '> 
        <div className='relative'>
          <div ref={blockRef} className='block w-[50px] h-[500px] bg-black relative'></div>
          <div ref={holeRef} className='hole w-[50px] h-[150px]  bg-dark-cyan relative left-[400px]'></div>
        </div>
        <div className='relative'>
          <div ref={blockRef2} className='block-2 w-[50px] h-[500px] bg-black relative '></div>
          <div ref={holeRef2} className='hole-2 w-[50px] h-[150px]  bg-dark-cyan left-[400px] relative'></div>
        </div>
      </div>
      <div ref={charRef} className='left-[20px] w-[20px] h-[20px] bg-apricot-200 absolute rounded-full top-[100px]'></div>
    </div>
  )}
   </>
  )
}

export default Game;