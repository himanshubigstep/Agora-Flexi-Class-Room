import React from 'react';

import { PathOptions } from '../svg-dict';

export const path = (props: PathOptions) =>
    <g fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M16.7676 14.9704C16.7676 14.8599 16.678 14.7704 16.5676 14.7704H15.6267C15.5162 14.7704 15.4267 14.8599 15.4267 14.9704V18.6596C15.4267 18.77 15.3371 18.8596 15.2267 18.8596H10.2549C10.1445 18.8596 10.0549 18.77 10.0549 18.6596V4.87508C10.0549 4.77657 9.98319 4.69273 9.88587 4.67749L5.19359 3.94259C5.14484 3.93495 5.15043 3.86307 5.19978 3.86307H15.2267C15.3371 3.86307 15.4267 3.95261 15.4267 4.06307V9.11672C15.4267 9.22717 15.5162 9.31672 15.6267 9.31672H16.5676C16.678 9.31672 16.7676 9.22717 16.7676 9.11672V2.7C16.7676 2.58954 16.678 2.5 16.5676 2.5H2.2C2.08954 2.5 2 2.58954 2 2.7V20.07C2 20.1601 2.06028 20.2391 2.14722 20.2629L9.80214 22.3574C9.9294 22.3923 10.0549 22.2965 10.0549 22.1645V20.4226C10.0549 20.3122 10.1445 20.2226 10.2549 20.2226H16.5676C16.678 20.2226 16.7676 20.1331 16.7676 20.0226V14.9704ZM18.1098 15.6451C18.1098 15.824 18.3269 15.9129 18.4524 15.7853L21.9972 12.1832C22.0738 12.1053 22.0738 11.9804 21.9972 11.9026L18.451 8.30023C18.3255 8.17271 18.1085 8.2616 18.1085 8.44054V10.4798C18.1085 10.5902 18.019 10.6798 17.9085 10.6798H11.5972C11.4867 10.6798 11.3972 10.7693 11.3972 10.8798V13.2073C11.3972 13.3178 11.4867 13.4073 11.5972 13.4073H17.9098C18.0203 13.4073 18.1098 13.4968 18.1098 13.6073V15.6451Z" fill={props.iconPrimary} />
    </g>



export const viewBox = '0 0 24 24';