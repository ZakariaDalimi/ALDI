import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { categoriesQuery } from '../../api/categoriesQuery';

const Categories = () => {
  const { data: categories, isLoading, isError, error } = useQuery(categoriesQuery);
  console.log(categories);
  
  return (
    <section className="px-page-desktop py-gutter-desktop" >Categories</section>
  )
}

export default Categories