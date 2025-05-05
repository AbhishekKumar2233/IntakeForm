import { useState , createRef  } from 'react';
import Tophead from '../../../components/paralLegalComponent/header/tophead';
import { useScreenshot } from 'use-react-screenshot';
import { connect } from 'react-redux';
import Assignselectshow from './Assignselectshow'

import Head from 'next/head';




const Index= (props) => {
  const ref = createRef(null)
  const [image, takeScreenshot] = useScreenshot()

  const getImage = () => {
    takeScreenshot(ref.current)
    
}

  return (
    <div ref={ref} className='bg-white'>
      <Head>
        <title>Aging Options</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      < div className = {
        (props.showloader ? "overlay bg-white" : "")
      } >
        {props.showloader == true &&
          (<div className="spinner-border text-primary blockuiloader"
              id="spinner" role="status">
              <span className="sr-only"></span>
          </div>)}
        <Tophead getImage={getImage} page="Assignrole" image={image} />
        <div className=""style={{
          position:"fixed",width: "100%",
          height:"100vh",
          // overflow:"hidden scroll",
          top:"128px",
          backgroundColor: "white"
         

          }}>
          <Assignselectshow />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state
});

export default connect(mapStateToProps, "")(Index);
