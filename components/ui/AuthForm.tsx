'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2, Truck } from 'lucide-react'


const AuthForm = ({ type }: { type: String }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof authFormSchema>>({
        resolver: zodResolver(authFormSchema),
        defaultValues: {
            email: "",
            password: '',
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof authFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true)
        console.log(values)
        setIsLoading(false)
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href="/" className="flex cursor-pointer items-center gap-1">
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Aloy logo"
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>Aloy</h1>
                </Link>
                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
                        {user ? 'Link Account' :
                            type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {user ? 'Link your Account to get started'
                            : 'Please enter your details'}
                    </p>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    {/* plaidlink */}
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {type === 'sign-Up' && (
                            <>
                            <CustomInput
                            control={form.control}
                            name='firstName'
                            label='First Name'
                            placeholder='Enter your firstname'
                            />
                            <CustomInput
                            control={form.control}
                            name='lastName'
                            label='Last Name'
                            placeholder='Enter your lastname'
                            />
                            <CustomInput
                            control={form.control}
                            name='address'
                            label='Address'
                            placeholder='Enter your specific address'
                            />
                            <CustomInput
                            control={form.control}
                            name='state'
                            label='State'
                            placeholder='Enter your specific State'
                            />
                            <CustomInput
                            control={form.control}
                            name='state'
                            label='State'
                            placeholder='example: SF'
                            />
                             <CustomInput
                            control={form.control}
                            name='potalCode'
                            label='Postal Code'
                            placeholder='example: 12345'
                            />
                                <CustomInput
                            control={form.control}
                            name='dateOfBirth'
                            label='Date of Birth'
                            placeholder='dd/mm/yyyy'
                            />
                            </>
                        ) }

                        <CustomInput
                            control={form.control}
                            name='email'
                            label='Email'
                            placeholder='Enter your Email'
                        />

                        <CustomInput
                            control={form.control}
                            name='password'
                            label='Password'
                            placeholder='Enter your Password'
                        />
                        <div className='flex flex-col w-full gap-4'>
                            <Button type="submit" className='form-btn' disabled={isLoading}>{isLoading ? (
                            <>
                            <Loader2 size={20} className='animate-spin' /> &nbsp; 
                            Loading... 
                            
                            </> ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'

                        }</Button>
                        </div>
                    </form>
                </Form>
            )}
                <footer className='flex justify-center gap-1'>
                    <p className='text-14 font-normal text-gray-600'>{type === 'sign in' ? "Don't have an account?" 
                    : "Alredy have an account?"}

                    </p>
                    <Link className='form-link' href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
                    {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                    </Link>
                </footer>
        </section>
    )
}

export default AuthForm