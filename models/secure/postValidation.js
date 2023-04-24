const yup = require('yup');

exports.schema = yup.object().shape({
    title: yup
        .string()
        .required('عنوان پست الزامی می باشد')
        .min(5, 'عنوان پست نباید کمتر از 5 کارکتر باشد')
        .max(100, 'عنوان پست نباید بیشتر از 100 کاراکتر باشد'),
    body: yup.string().required('پست جدید باید دارای محتوا باشد'),
    status: yup.mixed().oneOf(['private', 'public'], 'یکی از 2 وضعیت خصوصی یا عمومی را انتخاب کنید'),
    thumbnail: yup.object().shape({
        name: yup.string().required('عکس بند انگشتی الزامی می باشد'),
        size: yup.number().max(3000000, 'عکس نباید بیشتر از 3 مگابایت باشد'),
        mimetype: yup.mixed().oneOf(['image/jpeg', 'image/png'], 'تنها پسوندهای png و jpeg پشتیبانی می شوند')
    })
});