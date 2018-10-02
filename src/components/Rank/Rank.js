import React from 'react';


const Rank = ({entries, name}) =>
{
	return(
		<div>
			<div className='center white f3'>
				{` ${name}, your current count is....`}
			</div>
			<div className='center white f1'>
				{entries}
			</div>
		</div>
		);
}


export default Rank;