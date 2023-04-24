const yup = require('yup');

exports.schema = yup.object().shape({
    fullname: yup
        .string()
        .required('نام کاربری الزامی میباشد')
        .min(4, 'نام کاربری نباید کمتر از 4 کارکتر باشد')
        .max(255, 'نام کاربری نباید بیشتر از 255 کارکتر باشد'),
    email: yup.string().required('آدرس ایمیل الزامی است').email('ایمیل معتبر نیست'),
    password: yup
        .string()
        .required('کلمه عبور الزامی می باشد')
        .min(4, 'کلمه عبور نباید کمتر از 4 کاراکتر باشد')
        .max(255, 'کلمه عبور نباید بیشتر از 255 کاراکتر باشد'),
    confirmPassword: yup
        .string()
        .required('تکرار کلمه عبور الزامی می باشد')
        .oneOf([yup.ref('password'), null], 'تکرار کلمه عبور صحیح نیست')
});