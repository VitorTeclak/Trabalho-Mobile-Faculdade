import {View, Image, Pressable} from 'react-native'

export default function Rodape({img1, img2}) {
    return(
        <View>
            <Pressable onPress={()=>console.log('Biscoito Apertado')}>
                <Image source={img1} />
            </Pressable>
            <Pressable onPress={()=>console.log('Calculadora Apertada')}>
                <Image source={img2} />
            </Pressable>
        </View>
    )
}