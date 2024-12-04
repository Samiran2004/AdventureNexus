// Connect with mongoDb

import mongoose from 'mongoose';
import figlet from 'figlet';

const  connectDb = async (mongoURI: string): Promise<void>=>{
    try{
        await mongoose.connect(mongoURI);
        figlet(
            'D a t a b a s e   c o n n e c t e d',
           (err: Error | null, data: string | undefined): void =>
               err ? console.log('Figlet error...') : console.log(data)
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }catch(err){
        figlet(
           'D a t a b a s e  c o n n e c t i o n  e r r o r',
           (err: Error | null, data: string | undefined): void =>
               err ? console.log('Figlet error') : console.log(data)
        );
    }
}

export default connectDb;