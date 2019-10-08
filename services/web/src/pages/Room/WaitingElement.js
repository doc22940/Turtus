import React, {useState} from 'react' 
import styled from '@emotion/styled'
import { useObserver } from 'mobx-react-lite'
import { SyncLoader } from 'react-spinners'

import Icon from '../../icon-lib'
import { video } from '../../store'

const Container = styled.div`
  display : flex;
  user-select : none;
  width : 100%;
  height : 100%;
  justify-content : center;
  align-items : center;
  font-family : helvetica, arial;
  h2 {
    font-size : 2em;
  }

  h3 {
    font-size : 1.5em;
  }
  > content {
    color : white;
    width : 45%;
    min-height : 300px;
    width : 100%;
    border-radius : 15px;
    display : flex;
    align-items : center;
    justify-content : space-around;
    flex-direction : column;
    padding ; 5px;
  } 
  button {
    padding : 10px 5px;
    background : white;
    border : 1px solid black;
    outline : none;
  }
`

const Options = styled.div`
  display : flex;
  flex-direction : row;
  > div {
    margin : 10px 15px;
    cursor : pointer;
    text-align : center;
    transition : 200ms ease-out;
    flex : 1;
    display : flex;
    flex-direction : column;
    &:hover {
      transform : scale(1.05);
    }

    align-items : center;
    > * {
      margin : 8px 0;
    }
    > svg {
      font-size : 60px;
    }
    > span {
      max-width : 150px;
    }
  }
`



export default function WaitingElement(props){
  const { 
    onRequestBrowser
  } = props

  const options = [
    {
      title : 'Virtual Machine',
      action : onRequestBrowser,
      icon : 'robot',
      enabled : true,
      desc: 'Share a browser on a virtual machine that anyone can control. (Beta)'
    },
    {
      title : 'My Computer',
      icon : 'laptop',
      enabled : false,
      desc: 'Stream a tab, window, or entire desktop from your local computer. (Disabled)'
    },
    {
      title : 'URL',
      icon : 'link',
      enabled : false,
      desc : 'Stream from a variety of supported websites. (Disabled)'
    }
  ]

  const defaultDesc = '*cross your fingers and hope it works*'

  const [active, setActive] = useState(-1)

  return useObserver(()=>(
    <Container>
      <content>
        {
          video.streamMode === 'loading' && 
          <>
            <div>
              <h2>Waiting For the Stream To Start</h2>
            </div>
            <SyncLoader loading={true} color="white"/>
            <div>
              <p></p>
            </div>
          </>
        }
        {
          video.streamMode === null && 
          <>
            <div>
              <h2>How Do You Want To Stream? </h2>
            </div>
            <Options>
              {options.map((d,i)=>(
                <div 
                  style={{color:!d.enabled? 'gray':'inherit'}} 
                  onMouseEnter={()=>setActive(i)}
                  onClick={d.action} key={d.title}>
                  {/* <h3>{d.title}</h3> */}
                  <Icon icon={d.icon}/>
                </div>
              ))}
            </Options>
            <div>
              <p>{active >= 0 ? options[active].desc : defaultDesc}</p>
            </div>
          </>
        }
      </content>
    </Container>
  ))
}