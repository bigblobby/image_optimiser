import React from 'react';
import { Link } from "react-router-dom";

class Error404Page extends React.Component
{
    render(){
        return (
            <div className="error-page">
                <h1>Oops!</h1>
                <p>It looks like this page doesn't exist.</p>
                <Link className="btn btn--green" to={'/'}>Go Home</Link>
            </div>
        );
    }
}

export default Error404Page;
