import { ProtectedRoute } from '@/lib/ProtectedRoute'
import { UserAuthenticator } from '@/lib/authenticators/UserAuthenticator'
import { r2 } from '@/lib/util/r2'
import { generateRandomString } from '@/lib/util/random'
import { AuthenticatedNextRequest } from '@/types'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

export const POST = ProtectedRoute(UserAuthenticator, async (request: AuthenticatedNextRequest) => {
    try {
        console.log(`Generating an upload URL`)

        const filename = generateRandomString(10)
        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: filename,
            }),
            { expiresIn: 60 }
        )

        console.log(`Success generating upload URL!`)

        return NextResponse.json({signedUrl})

        
    } catch (err) {
        console.log('error')
    }
})
