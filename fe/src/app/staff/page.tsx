'use client'
import {redirect} from 'next/navigation'
import { useEffect } from 'react'
export default function Staff(){
    useEffect(()=>{
        redirect('/staff/sell')
    },[])
    return <>
    </>
}