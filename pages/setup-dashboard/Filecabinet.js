import React ,{useState,useEffect} from 'react'
import SetupLayout from '../../component/Layout/SetupLayout'
import ParentCabinet from '../../components/newFileCabinet2/ParentCabinet'
const Filecabinet = () => {
    const [isSetupRendered, setIsSetupRendered] = useState(false);

    useEffect(() => {
        // This will run after the component has mounted
        setIsSetupRendered(true);
    }, []);
    return (
        <SetupLayout name='Filecabinet' id='10'>
          {isSetupRendered &&  <ParentCabinet /> }
        </SetupLayout>
    )
}

export default Filecabinet
