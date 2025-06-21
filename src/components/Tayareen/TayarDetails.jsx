import React from 'react'
import CardIdentifier from '../CardIdentifier/CardIdentifier'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Errors from '../Error/Errors';
import Loader from '../Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import img from "../../images/user.png"

export default function TayarDetails() {
    const {id}=useParams();
    async function getTayarDetails() {
        try{
            const res=await axios.get(`https://wassally.onrender.com/api/crews/${id}/`, {
                headers: {
                    Authorization: 'Token ' + localStorage.getItem('token')
                }
            });
            console.log('Tayar Details:', res.data.data);
            return res?.data.data;
        } catch (error) {
            console.error('Error fetching Tayar details:', error);
            throw error;
        }
    }
    
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['tayarDetails', id],
        queryFn: getTayarDetails,
    });
    if (isLoading) return <Loader />;
    if (isError) return <Errors message={error.message || 'Failed to load Tayar details'} />;
    return <>
    <CardIdentifier
      image={img || ""}
      title={data?.username || "Tayar Name"}
      phone={data?.phone_number}
      type={data?.crew_type}
      isActive={data?.is_active}


        // nationalIdFront={data?.national_id_image_front || ""}
        // nationalIdBack={data?.national_id_image_back || ""}
        
        nationalIdFront={img|| ""}
        nationalIdBack={img || ""}
        
        balance={data?.balance || 0}
      imageFallback="https://wassally.onrender.com/media/crew/default.jpg"
    //   notes={data?.notes || "Some notes about the Tayar"}
    />
  </>
  
}