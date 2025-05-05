import { useRouter } from "next/router";
import PersonalInformation from "../../component/Personal-Information/PersonalInformation";
import { useEffect, useState } from "react";
import konsole from "../../components/control/Konsole";
import SetupSidebar from "../../component/Layout/Sidebar/SetupSidebar";
import SetupLayout from "../../component/Layout/SetupLayout";
import { useAppDispatch } from "../../component/Hooks/useRedux";
import { setAccessFromIframe } from "../../component/Redux/Reducers/uiSlice";

export default function RequestHandler () {
    const router = useRouter();
    const { selectedPage, userId } = router.query;
    const [showComponent, setShowComponent] = useState('');
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setAccessFromIframe(true));
        const requestedPage = selectedPage?.replace('iframe', '');
        setShowComponent(requestedPage);
    })

    konsole.log("fsnbjkfj", selectedPage, userId, showComponent)

    return (
        <>
        {/* <SetupSidebar hideAllContent={true} > </SetupSidebar>  */}
        {/* Just using it's functionality and NO UI  */}

        <SetupLayout name='Personal Information' id='1' hideAllContent={true}></SetupLayout>
        <div className="useNewDesignSCSS" style={{height: '100vh', overflowY: 'auto'}}>
        {
            showComponent == "/personalInfo" ? <PersonalInformation /> : <p>Loading...</p>
        }
        </div>
        </>
    )
}