import React from 'react'
import Hero from '../../Components/Hero'
import { slideData, slideData2 } from '../../Test/MockData'
import Grid from '../../Components/Grid'
import Cards from '../../Components/Cards'

const Root = () => {
  return (
    <section>
        <Hero slides={slideData} />
        <Grid />
        <Cards slides={slideData2}/>
    </section>
  )
}

export default Root