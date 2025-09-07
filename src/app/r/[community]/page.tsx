import React from 'react'

export default function page({params}: {params: {community:string}}) {
    const {community} = params;
  return (
    <div className='pt-12'>
      {community}
    </div>
  )
}
