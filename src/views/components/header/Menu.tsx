import React from 'react';

function Menu(props: {showVerticalMenu: boolean, setShowVerticalMenu: React.Dispatch<React.SetStateAction<boolean>>}): JSX.Element {
    const handleMenuClick = (_event: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
        props.setShowVerticalMenu(!props.showVerticalMenu);
    };
    
    return (
        <span>
            <svg width="37px" height="46px" viewBox="0 0 32 26" version="1.1" onClick={handleMenuClick} className="hamburger" id="hamburgerLight">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                      <g id="Artboard" stroke="#000000" strokeWidth="4">
                          <line x1="4" y1="13" x2="29" y2="13" id="Line"></line>
                          <line x1="4" y1="5" x2="29" y2="5" id="Line"></line>
                          <line x1="4" y1="21" x2="29" y2="21" id="Line"></line>
                      </g>
                  </g>
              </svg>
            <svg width="37px" height="46px" viewBox="0 0 32 26" version="1.1" onClick={handleMenuClick} className="hamburger" id="hamburgerDark">
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                    <g id="Artboard" stroke="#FFFFFF" strokeWidth="4">
                        <line x1="4" y1="13" x2="29" y2="13" id="Line"></line>
                        <line x1="4" y1="5" x2="29" y2="5" id="Line"></line>
                        <line x1="4" y1="21" x2="29" y2="21" id="Line"></line>
                    </g>
                </g>
            </svg>
        </span>
        
    )
}

export default Menu;