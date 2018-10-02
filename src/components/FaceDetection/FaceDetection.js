import React from 'react';
import './FaceDetection.css';

const FaceDetection = ({imageURL, box}) =>
{
	console.log('in FaceDetection', box);
	return(
			<div className='center ma'>
				<div className='absolute mt2'>
					<img  id='inputimage' src={imageURL} alt="" width='500px' height='auto' />
					<div className='bounding-box'  style={{top: box.topRow, right: box.rigthCol, bottom: box.bottomRow, left: box.leftCol }}></div>
				</div>
			</div>
		);
}

export default FaceDetection; 