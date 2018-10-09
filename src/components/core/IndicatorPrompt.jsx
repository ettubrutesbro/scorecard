
const Prompt = styled.div`
	h1{
		font-size: 24px;
		font-weight: normal;
	}
`
const IndicatorListButton = styled.div`
	background: black;
	color: white;
	// width: 100%;
	display: flex;
	padding: 10px;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`
const Indicator = styled.div`

	border: 1px solid black;
	padding: 10px;
	&:not(:first-of-type){
		margin-top: 10px;
	}
`
const IndicatorPrompt = (props) => {
	return(
		<Prompt>
			<h1> Select an indicator </h1>
			{Object.keys(indicators).map((ind)=>{
				return(
					<Indicator
						onClick = {()=>props.onSelect(ind)}
					> 
						{semanticTitles[ind].label} 
					</Indicator>
				)


			})}
			<IndicatorListButton> See full list of indicators </IndicatorListButton>
		</Prompt>
	)
}