
import InfLog from '../components/Infinte'
import Grid from '../components/Grid'
import Game from '../components/Game'
import {useMediaQuery} from 'react-responsive';

const HomePage = () => {
    const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })

  return (
    <div className='h-full bg-apricot'>
        <Grid />
        <div className={`flex flex-row mt-2 items-center biz-udpgothic-regular`}>
          <Game/>
          {isDesktopOrLaptop ? (<div className={` ${isDesktopOrLaptop ? 'w-[600px]': 'w-[350px]'} h-[500px]  hover:scale-110 transition-transform duration-600 ease-in-out m-auto rounded-xl bg-yellow-400 overflow-hidden relative shadow-2xl shadow-dark-cyan-400`}>
            <img src="/hand.png" className='z-100 absolute size-80 mt-30 ' />
            <div className=' rounded-full h-[300px] w-[300px] bg-white z-10'><div className='alfa-slab-one-regular text-4xl ml-40 mt-10 absolute text-black '>'情欲に縛られた'
            <div className='absolute mx-[150px] my-[150px] rounded-full h-[300px] w-[300px] bg-white '>
              <img src="/legs.png" className='size-66 absolute'/>
            </div></div></div>
          </div>): (<div>
            </div>)}
        </div>
        <div className='h-[40px]'>
        </div>
        <InfLog/>
    </div>
  )
}

export default HomePage