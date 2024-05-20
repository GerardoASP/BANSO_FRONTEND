import React, { useState } from 'react';
import "./VerifyComponent.scss";

const VerifyComponent = () => {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const goToLogin = () => {
        console.log('Di click en goToLogin');
        window.location.href = '/login';
    }

    const handleVerify = async () => {
        const userData = {
            email: email,
        }

        try {
            const response = await fetch(`https://bansobackend-production.up.railway.app/api/v1/users/get-user-by-email/${userData.email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            console.log(data)

            if (typeof data !== 'undefined' && data !== null) {
                const userData2 = {
                    active: true
                }

                try {
                    await fetch(`http://localhost:3002/api/v1/users/update-user/${data._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData2),
                    });
                    setVerificationSuccess(true); // Actualiza el estado para mostrar la alerta de verificación exitosa
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error('Process failed:', data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container">
            <form className="login-form">
                <h1 className="form-title">Validar Cuenta</h1>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        className="form-input"
                        name="email"
                        type="text"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className="form-button" onClick={handleVerify} type="button">Validar Cuenta</button>
                <button className="form-button" onClick={goToLogin} type="button">Iniciar Sesión</button>
                {verificationSuccess && <div className="alert">¡Cuenta verificada correctamente!</div>}
            </form>
        </div>
    );
}

export default VerifyComponent;
