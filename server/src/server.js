import Hapi from 'hapi';
import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';
import Joi from 'joi';
import Pack from '../package';
import MintToken from './modules/MintToken';

/*const server = new Hapi.Server({
    host:'localhost',
    port:5000,
    routes: { 
        cors: true
    }
});

// Endpoint mint token
server.route({
    method: 'POST',
    path: '/mint-token',
    handler: async (request, h) => {
        const mintToken = new MintToken(request.payload);
        const mintTokenResponse = await mintToken.run();
        const response = h.response(mintTokenResponse.data);
        response.code(mintTokenResponse.code);
        response.header('Content-Type', 'application/json; charset=utf-8');
        return response;
    }
});

server.start((err) => {
    if( err ) {
        // Fancy error handling here
        console.error( 'Error was handled!' );
        console.error( err );
    } 
    console.log( `Server started at ${ server.info.uri }`);
});
*/

(async () => {
    const server = await new Hapi.Server({
        host:'localhost',
        port:5000,
        routes: { 
            cors: true
        }
    });
    
    const swaggerOptions = {
        info: {
                title: 'Real State Token API Documentation',
                version: Pack.version,
            },
        };
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
    }
    
    // returns remainder
    server.route({
        path: '/api/mint-token',
        method: 'POST',
        config: {
            handler: async (request, reply) => {
                const mintToken = new MintToken(request.payload);
                const mintTokenResponse = await mintToken.run();
                const response = reply.response(mintTokenResponse.data);
                response.code(mintTokenResponse.code);
                response.header('Content-Type', 'application/json; charset=utf-8');
                //var rem = parseInt(request.payload.a) % parseInt(request.payload.b);
                //const response = reply.response(rem);
                return response;
            },
            description: 'Mint Real State Token',
            notes: 'Pass solution for Zk-Snark zokrates validation, token ID and address',
            tags: ['api'],
            validate: {
                payload: {
                    tokenId: Joi.number().required(),
                    address: Joi.string().required(),
                    proof : Joi.object().required(),
                    input : Joi.array().items(Joi.number()).required(),
                }
            }   
        }
    });
})();