const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('User export:', User);
console.log('typeof User.findOne:', typeof (User && User.findOne));
// register route

router.post('/register', async(req,res)=>{
    try{
        const {name , email , password} = req.body;
        // check if user already exist    

        const existingUser = await User.findOne({email});
        if(existingUser){
        return res.status(400).json({message:'user already exist'});
        }
        //hash the password
        //we generate a 'salt' (random data) and mix it with the pasword
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // create and save the user 
        const newUser = new User({
          name,email, password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({message:'user created successfully'})
      } 
    
    catch(error){
        res.status(500).json({message:error.message})
      };
    })

  //Login route
  router.post('/login', async(req,res)=>{
    try{
      const{email,password}= req.body;
      //check if user exist

      const user= await User.findOne({email})
      if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
      }

      //validate password
      //compare the password they typed with hash in the Db
      const isMatch = await bcrypt.compare(password, user.password)
      if(!isMatch){
        return res.status(400).json({message:'Invalid credential'});
      }
      // create jwt (The digital key)
      // THIS TOKEN contains your id and is signed with your secret key
      const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
      );

      res.json({token,user:{ id:user._id,name:user.name,email: user.email }})

    }catch(error){
      res.status(500).json({ message: error.message });
    }

  })


module.exports = router;