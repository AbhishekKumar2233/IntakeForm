import Head from 'next/head'
import Image from 'next/image'
import Dashboard from './dashboard'
import Header from '../components/header'
import Login from './login'
import "../node_modules/react-datepicker/dist/react-datepicker.css";

export default function Home() {
  
  return (
  <div>    
    <Login />
  </div>
  )
}
