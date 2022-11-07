//const { sequelize } = require('./models/index.js');
// const bcrypt = require('bcryptjs');

// const passCrypt = async(pass) => {
//    const r = await bcrypt.hash(pass, 8);
//    console.log(r)
//    return r
// }

// passCrypt('AdminP@ss8990').then((result)=>{
//     console.log(result)
// })

// async function main(){
//     await sequelize.sync({ alter: true });
// }

//main()


// const users = await Users.findAll({
//     where: {
//         createdAt: {
//             [Op.gte]: moment().subtract(7, 'days').toDate()
//         }
//     }
// })


//✅✅✅
// fromPostman = {
//     "date" : "2022-10-01"
// }
// const user = await Users.findAll({
//     where: {
//         date: {
//             [Op.lt] : da
//         }
//     }
// })


//-------------------------------------DB----------------------------



//--------------------------- IMage 

// app.post('/testing2',  async(req, res)=>{
//     console.log(req.body)
//     const {title, description, previewSource} = req.body;
//     console.log(previewSource)

//     try{
//         const imageUpload = await cloudinary.uploader.upload(previewSource, {
//             upload_preset: 'first_testing'
//         })
//         console.log(imageUpload)
//         res.send({post:'created'})
//     }catch(e){
//         console.log(e);
//         res.status(500).json({error: 'Something went wrong.'})
//     }
// })
