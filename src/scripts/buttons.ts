export function returnThemeValue(){
    const FIELDSET = document.getElementById("field_themes") as HTMLFieldSetElement;

    if(!FIELDSET) return;
    const THEME = FIELDSET.querySelector('input[type="radio"]:checked') as HTMLInputElement
    if (THEME) {
        console.log(THEME.value);
        console.log('id: ', THEME.id);        
    } else {
        console.log('nothing');
        
    }
}